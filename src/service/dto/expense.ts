export interface CreateExpenseDto {
  price: number;
  description: string;
  date: Date;
}

export interface UpdateExpenseDto
  extends Partial<Omit<CreateExpenseDto, 'userId'>> {}
