import { BadRequestError, IAuthPayload, NotAuthorizedError } from "@manoj19-github/microservice_shared";
import { NextFunction, Response,Request } from "express";
import JWT from "jsonwebtoken"
import { EnvVariable } from "../config/envVariable";


class AuthMiddleware{
    public verifyUser(request:Request,res:Response,next:NextFunction):void{
        try{
            if(!request.session?.jwt) throw new NotAuthorizedError("Token not avilable. Please login again","Gateway service verifyuser method error");
            const payload:IAuthPayload = JWT.verify(request.session.jwt,`${EnvVariable.JWT_TOKEN}`) as IAuthPayload;
            request.currentUser = payload;
            next();
        }catch(error){
            console.log('error: ', error);
            throw new NotAuthorizedError("Token not avilable. Please login again","Gateway service verifyuser method error");

        }
        
    }

    // check authentication 
    public checkAuthentication(request:Request,res:Response,next:NextFunction):void{
        try{
            if(!request?.currentUser) throw new BadRequestError("Authentication is required to access this route","gateway service check authentication method error")
                
            next();
        }catch(error){
            console.log('error: ', error);
            throw new NotAuthorizedError("Token not avilable. Please login again","Gateway service verifyuser method error");

        }

    }

}
export const authMiddleware:AuthMiddleware = new AuthMiddleware();
