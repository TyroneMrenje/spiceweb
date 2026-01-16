
import { Request, Response} from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController{
    async registerUser( req:Request, res:Response){
        try{
          const {email, username, password} =req.body;
        
          if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
          }

          if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
          } 
          const user= await userService.registerUser({email, username, password})
          
          res.status(201).json({
            message:"Success",
            user
          })
        } catch(e: unknown){
          if(e instanceof Error){
            res.status(500).json({ error: e.});
          }
        }     
   }

   async login(req:Request, res:Response, next: any) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Invalid email or password' 
        });
      }

      const result = await userService.login(email, password);

      res.json({
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error:error.message });
      }

    }
  }

  async refreshToken(req:Request, res:Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ 
          error: 'Refresh token is required' 
        });
      }

      const result = await  userService.refreshAccessToken(refreshToken);
      res.json(result);

    } catch (error) {
      if (error instanceof Error ) {
        return res.status(401).json({ error: error.message });
      }
     
    }
  }

  async logout(req:Request, res:Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ 
          error: 'Refresh token is required' 
        });
      }

      const result = await userService.logoutAll(refreshToken);

      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  async getAllUsers(req:Request, res:Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }  
    }
  }

  async updatePassword(req:Request, res:Response) {
    try {
      const { password } = req.body;
      const { userId} = req.params as { userId: string };

      if(password.length < 8){
        return  res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
     
      const user = await userService.updatePassword(userId, { password });
      res.json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } 
    }
  }

  async deleteUser(req:Request, res:Response ) {

     const { userId} = req.params as { userId: string };

    try {     
      const result = await userService.deleteUser(userId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
     
    }
  }
}


