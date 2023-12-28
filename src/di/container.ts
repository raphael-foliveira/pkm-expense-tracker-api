import { DataSource } from 'typeorm';
import {
  ExpenseRepository,
  UserRepository,
} from '../service/interfaces/repository';
import { ExpenseService } from '../service/expense';
import { ExpenseController } from '../http/controller/expense';
import { UserService } from '../service/user';
import { AuthService } from '../service/auth';
import { AuthController } from '../http/controller/auth';
import { UserController } from '../http/controller/user';
import { UserRepositoryImpl } from '../persistence/repository/user';
import { User } from '../persistence/entitites/user';
import { ExpenseRepositoryImpl } from '../persistence/repository/expense';
import { Expense } from '../persistence/entitites/expense';
import { JwtService } from '../service/jwt';
import { HealthCheckController } from '../http/controller/healthcheck';

interface DIProps {
  accessTokenSecret: string;
  refreshTokenSecret: string;
}

export class DIContainer {
  private expenseRepository: ExpenseRepository;
  private expenseService: ExpenseService;
  private expenseController: ExpenseController;
  private userRepository: UserRepository;
  private userService: UserService;
  private userController: UserController;
  private healthCheckController: HealthCheckController;
  private authService: AuthService;
  private jwtService: JwtService;
  private authController: AuthController;
  private static instance: DIContainer;

  private constructor(
    private dataSource: DataSource,
    private config: DIProps,
  ) {}

  static getInstance(dataSource: DataSource, config: DIProps) {
    if (!this.instance) {
      this.instance = new DIContainer(dataSource, config);
    }
    return this.instance;
  }

  resolveExpenseRepository() {
    if (!this.expenseRepository) {
      this.expenseRepository = new ExpenseRepositoryImpl(
        this.dataSource.getRepository(Expense),
      );
    }
    return this.expenseRepository;
  }

  resolveExpenseService() {
    if (!this.expenseService) {
      this.expenseService = new ExpenseService(
        this.resolveExpenseRepository(),
        this.resolveUserRepository(),
      );
    }
    return this.expenseService;
  }

  resolveExpenseController() {
    if (!this.expenseController) {
      this.expenseController = new ExpenseController(
        this.resolveExpenseService(),
        this.resolveAuthService(),
      );
    }
    return this.expenseController;
  }

  resolveUserRepository() {
    if (!this.userRepository) {
      this.userRepository = new UserRepositoryImpl(
        this.dataSource.getRepository(User),
      );
    }
    return this.userRepository;
  }

  resolveUserService() {
    if (!this.userService) {
      this.userService = new UserService(this.resolveUserRepository());
    }
    return this.userService;
  }

  resolveUserController() {
    if (!this.userController) {
      this.userController = new UserController(this.resolveUserService());
    }
    return this.userController;
  }

  resolveAuthService() {
    if (!this.authService) {
      this.authService = new AuthService(
        this.resolveUserRepository(),
        this.resolveJwtService(),
      );
    }
    return this.authService;
  }

  resolveAuthController() {
    if (!this.authController) {
      this.authController = new AuthController(this.resolveAuthService());
    }
    return this.authController;
  }

  resolveJwtService() {
    if (!this.jwtService) {
      this.jwtService = new JwtService({
        accessToken: this.config.accessTokenSecret,
        refreshToken: this.config.refreshTokenSecret,
      });
    }
    return this.jwtService;
  }

  resolveHealthCheckController() {
    if (!this.healthCheckController) {
      this.healthCheckController = new HealthCheckController();
    }
    return this.healthCheckController;
  }
}
