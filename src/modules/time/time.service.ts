import { Injectable } from "@nestjs/common";
import { TimeReponsitory } from "../../repositories/time.reponsitory";
import { TimeDto } from "./dto/time.dto";

@Injectable()
export class TimeService{
    constructor(private readonly timeReponsitory: TimeReponsitory){}
    async createTime(timeDto: TimeDto): Promise<any> {
        const time = await this.timeReponsitory.create(timeDto);
        return time;
      }
    
      async getAlltime(): Promise<any> {
        const getall = await this.timeReponsitory.getAlltime();
        return getall;
      }
      async gettime(timeId: any): Promise<any> {
        const getTime = await this.timeReponsitory.getTime(timeId);
        return getTime;
      }
    
      async updateTime(timeId: any, dataUpdate): Promise<any> {
        const update = await this.timeReponsitory.updateTime(timeId,dataUpdate
         );
        return update;
      }
    
      async deleteTime(timeId: any): Promise<any> {
        const deleteTime = await this.timeReponsitory.deleteTime(timeId);
        return deleteTime;
      }

}