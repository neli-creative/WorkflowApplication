import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async signUp(signupData: SignupDto): Promise<void> {
    const {
      email,
      password,
      firstName,
      lastName,
      role = Role.USER,
    } = signupData;

    const emailInUse = await this.userModel.findOne({
      email,
    });

    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role.toUpperCase(),
    });
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateUserTokens(
      user._id.toString(),
      user.role,
    );
    return {
      ...tokens,
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refreshToken: string }> {
    const token = await this.refreshTokenModel.findOne({
      token: refreshToken,
      expiresAt: { $gte: new Date() },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userModel.findById(token.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateUserTokens(token.userId, user.role);
  }

  async generateUserTokens(
    userId: string,
    role: Role,
  ): Promise<{ access_token: string; refreshToken: string }> {
    const normalizedRole = role.toUpperCase() as Role;

    const access_token = this.jwtService.sign(
      { userId, role: normalizedRole },
      { expiresIn: '1h' },
    );

    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return { access_token, refreshToken };
  }

  async storeRefreshToken(token: string, userId: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);
    await this.refreshTokenModel.updateOne(
      {
        userId,
      },
      { $set: { expiresAt, token } },
      { upsert: true },
    );
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }
}
