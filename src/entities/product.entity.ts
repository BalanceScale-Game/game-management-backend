import { float } from '@elastic/elasticsearch/lib/api/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public code: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public price: float;
}

export default Product;
