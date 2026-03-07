import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { first } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private db: DatabaseService,
  ) {}

  async register(registerDto: RegisterDto) {
    const exsistingUser = await this.db.user.findUnique({
      where : {email:registerDto.email},
    });
    if(exsistingUser){
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password,10);

    const user = await this.db.user.create({
      
      data:{
        ...registerDto,
        password:hashedPassword,
      }
    });

    return {
      message:'User registered Successfully',
      user:{
        id :user.id,
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName,
      }
    };
  }

 async login(loginDto:LoginDto){
  const user = await this.db.user.findUnique({
    where :{email:loginDto.email},

  });
  if (!user) {
    throw new UnauthorizedException('User not registered');
  }
  const isPasswordValid = await bcrypt.compare(
    loginDto.password,
    user.password,
  )
  if(!isPasswordValid){
    throw new UnauthorizedException('Invalid Password');
  }
  const payload = {
    sub :user.id,
    email:user.email,
    firstName:user.firstName,
    
  }
  return {
    access_token : this.jwtService.sign(payload),
  };

 }
}