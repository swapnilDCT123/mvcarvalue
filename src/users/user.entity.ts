import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';
// import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Insterted user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Update user with id', this.id);
  }

  @AfterRemove()
  logremove() {
    console.log('remove user with id', this.id);
  }
}
