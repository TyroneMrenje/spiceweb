
const jwt = require('jsonwebtoken');


export class JWTUtil {
  static generateAccessToken(userId:string) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  }

  static generateRefreshToken(userId: string) {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '1d' }
    );
  }

  static verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(refreshtoken: string) {
    try {
      return jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}