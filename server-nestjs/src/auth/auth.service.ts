import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    const user = await this.usersService.create(email, password, username);

    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!password) {
      throw new UnauthorizedException("Password is required");
    }
    if (!user.password) {
      throw new UnauthorizedException("Password is not set for this account");
    }
    const isValid = await this.usersService.validatePassword(user, password);
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }
}
