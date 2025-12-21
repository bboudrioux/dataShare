import { Controller, Get, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtenir les infos de mon profil (via token)' })
  getMe(@GetUser('userId') userId: string) {
    return this.userService.getById(userId);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Supprimer mon propre compte' })
  deleteMe(@GetUser('userId') userId: string) {
    return this.userService.delete(userId);
  }
}
