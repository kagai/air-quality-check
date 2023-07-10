import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ts: Date;

  @Column()
  aqius: number;

  @Column()
  mainus: string;

  @Column()
  aqicn: number;

  @Column()
  maincn: string;
}
