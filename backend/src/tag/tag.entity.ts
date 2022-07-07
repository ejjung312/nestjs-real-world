import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TagEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '인덱스' })
  id: number;

  @Column()
  @ApiProperty({ description: '태그' })
  tag: string;
}
