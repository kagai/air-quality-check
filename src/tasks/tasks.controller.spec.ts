import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should call tasksService.create with the correct parameters', () => {
      const createTaskDto: CreateTaskDto = { title: 'Task 1', description: 'Task description' };

      jest.spyOn(tasksService, 'create').mockReturnValueOnce(Promise.resolve({ id: 1, ...createTaskDto }));

      const result = tasksController.create(createTaskDto);

      expect(tasksService.create).toHaveBeenCalledWith(createTaskDto);
      expect(result).resolves.toEqual({ id: 1, ...createTaskDto });
    });
  });

  describe('findAll', () => {
    it('should call tasksService.findAll and return the result', () => {
      const tasks = [{ id: 1, title: 'Task 1', description: 'Task description' }];

      jest.spyOn(tasksService, 'findAll').mockReturnValueOnce(Promise.resolve(tasks));

      const result = tasksController.findAll();

      expect(tasksService.findAll).toHaveBeenCalled();
      expect(result).resolves.toEqual(tasks);
    });
  });

  describe('findConcentratedTime', () => {
    it('should call tasksService.findPollutionConcentration and return the result', () => {
      const concentrationTime = 10;

      jest.spyOn(tasksService, 'findPollutionConcentration').mockReturnValueOnce(Promise.resolve(concentrationTime));

      const result = tasksController.findConcentratedTime();

      expect(tasksService.findPollutionConcentration).toHaveBeenCalled();
      expect(result).resolves.toEqual(concentrationTime);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
