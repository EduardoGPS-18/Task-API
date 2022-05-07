import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './authenticated-user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    try {
      const user = await this.authService.signUp(authCredentialsDto);
      this.logger.verbose(
        `New user registered on the system ${user.username}, user id: ${user.id} `,
      );
      return user;
    } catch (err) {
      this.logVerboseLog('signup', err, authCredentialsDto);
      throw err;
    }
  }

  @Post('signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthenticatedUser> {
    try {
      return await this.authService.signIn(authCredentialsDto);
    } catch (err) {
      this.logVerboseLog('signin', err, authCredentialsDto);
      throw err;
    }
  }

  private logVerboseLog(
    context: string,
    err: Error,
    authCredentialsDto: AuthCredentialsDto,
  ) {
    this.logger.verbose(
      `Error on ${context} ${authCredentialsDto.username}. Cause: ${err.message}`,
    );
    throw err;
  }
}
