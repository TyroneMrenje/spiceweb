import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt"
import { JWTUtil } from "../config/jwt.utils";

const prisma =new PrismaClient();

 export class UserService{
   async registerUser(data: {email:string, username:string, password:string}){

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user= await prisma.user.create({
        data:{
            email:data.email,
            password:hashedPassword,
            username:data.username,
            role:"USER"
        },
        select:{
            id:true,
            email:true,
            username:true
        }
    })
    return user;
   }

   async storeRefreshToken(userId:string, token:string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); 

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  }

  async login(email:string, password:string ){
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

     if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    const accessToken = JWTUtil.generateAccessToken(user.id);
    const refreshToken = JWTUtil.generateRefreshToken(user.id);

   
    await this.storeRefreshToken(user.id, refreshToken);

    return {user, accessToken, refreshToken};
  }

  async refreshAccessToken(refreshToken:string) {
   
    const decoded = JWTUtil.verifyRefreshToken(refreshToken);

    
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const accessToken = JWTUtil.generateAccessToken(decoded.userId);

    return { accessToken };
  }


  async logoutAll(refreshToken:string) {
    
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });

    return { message: 'Logged out from all devices' };
  }

  
  async cleanExpiredTokens() {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }

  async getAllUsers(){
    
    return await prisma.user.findMany({
        select:{
            id:true,
            email:true,
            username:true,
            createdAt:true
        },orderBy:{
            createdAt:'desc'
        }
    })
  }


  async updatePassword(userId:string, data:{password:string}) {

const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true
      }
    });   
  }

  async deleteUser(userId:string) {
    await prisma.user.delete({
      where: { id: userId }
    });

    return { message: 'User deleted successfully' };
  }
}

