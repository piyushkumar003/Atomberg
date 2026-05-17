import { IsNotEmpty, IsString, IsNumber, Min, Max, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UOMType } from '@prisma/client';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  cycle_id: string;

  @IsNotEmpty()
  @IsString()
  thrust_area: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(UOMType)
  uom_type: UOMType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  target_value: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(10)
  @Max(100)
  weightage: number;

  @IsOptional()
  @IsBoolean()
  is_shared?: boolean;

  @IsOptional()
  @IsString()
  shared_goal_root_id?: string;
}
