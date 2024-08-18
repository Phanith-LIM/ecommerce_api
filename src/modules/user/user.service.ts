import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signupDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(signupDto.email);
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }
    signupDto.password = await hash(signupDto.password, 10);
    let user = this.userRepository.create(signupDto);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signIn(signInDto: UserSignInDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: signInDto.email },
      select: [
        'id',
        'name',
        'email',
        'password',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new BadRequestException('Bad credentials');
    }

    const matchPassword = await compare(signInDto.password, user.password);

    if (!matchPassword) {
      throw new BadRequestException('Bad credentials');
    }

    delete user.password;
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const isUserExit = await this.userRepository.findOneBy({ id: id });
    if (!isUserExit) {
      throw new NotFoundException('User does not exist');
    }
    return isUserExit;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ email: email });
  }

  accessToken(user: UserEntity) {
    return this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
      },
      {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      },
    );
  }
}
