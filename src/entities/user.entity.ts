import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './address.entity';
import Role from './role.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  @ApiProperty()
  public email: string;

  @Column()
  @ApiProperty()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  public address: Address;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles', // table name for the junction table of this relation
    joinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}

export default User;
