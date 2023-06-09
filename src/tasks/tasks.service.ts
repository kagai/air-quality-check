import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { LoggerService } from 'src/logger/logger.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AppService } from 'src/app.service';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: LoggerService = new Logger(TasksService.name),
    private readonly appService: AppService,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('This is called every 1 minute');

    // TODO: Move to config file
    const lat = 48.856613;
    const lon = 2.352222;

    const task = new Task();

    try {
      const response = await this.appService.getAirQualityNearestCity(lat, lon, process.env.AIR_QUALITY_API_KEY);

      this.logger.debug(`handleCron response: ${JSON.stringify(response)}`);
      const pollutionData = response;

      task.ts = new Date(pollutionData.ts);
      task.aqius = pollutionData.aqius;
      task.mainus = pollutionData.mainus;
      task.aqicn = pollutionData.aqicn;
      task.maincn = pollutionData.maincn;

      await this.taskRepository.save(task);
    } catch (error) {
      // Handle error if necessary
      this.logger.error(`handleCron error: ${JSON.stringify(error)}`);
    }
  }

  @Interval(10000)
  handleInterval() {
    this.logger.debug('Called every 10 seconds');
  }

  @Timeout(5000)
  handleTimeout() {
    this.logger.debug('Called once after 5 seconds');
  }

  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async findPollutionConcentration(): Promise<string> {
    const tasks = await this.taskRepository.find();

    let maxConcentration = 0;
    let date_time;
    for (const task of tasks) {
      if (task.aqius > maxConcentration) {
        maxConcentration = task.aqius;
        date_time = task.ts;
      }
    }

    return date_time;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
