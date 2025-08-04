// src/dto/user.ts
import { Rule, RuleType } from '@midwayjs/validate';

export class UserDTO {

    @Rule(RuleType.string().required())
    userName: string;

    @Rule(RuleType.string().required())
    passWord: string;
    
}

export class RoleListDTO {

    @Rule(RuleType.string().required())
    cookiesString: string;
    
}

export class AddSignInDTO {

    @Rule(RuleType.string().required())
    ruleId: string;

    @Rule(RuleType.string().required())
    longitude: string;

    @Rule(RuleType.string().required())
    latitude: string;

    @Rule(RuleType.string().required())
    address: string;

    @Rule(RuleType.string().required())
    signPosintionId: string;
    
    @Rule(RuleType.string().required())
    cookiesString: string;
    
    @Rule(RuleType.number().required())
    againsignin: 0 | 1;

}