import firebaseAdmin from "firebase-admin";
import ValidationException from "../utils/exceptions/ValidationException";
import { firestore } from "../utils/firebase";

type FirebaseField = string | FirebaseFirestore.FieldPath;
type FilterCondition = {
  field: FirebaseField;
  op: FirebaseFirestore.WhereFilterOp;
  value: number | string | boolean;
};
type OrderCondition = {
  field: FirebaseField;
  direction?: "desc" | "asc";
};

export class BaseFirebaseService<T> {
  protected _collection: ReturnType<typeof firestore.collection> | undefined;

  protected init(collectionName: string) {
    this._collection = firestore.collection(collectionName);
  }

  protected get collection(): ReturnType<typeof firestore.collection> {
    if (!this._collection) {
      throw new ValidationException("Collection is not initialized");
    }

    return this._collection;
  }

  public async get(id: string): Promise<T | undefined> {
    const snapshot = await this.collection.doc(id).get();

    return snapshot.data() as T;
  }

  public async create(item: Partial<T>): Promise<T> {
    const { id } = await this.collection.add(item);

    // eslint-disable-next-line
    return { ...item, id } as any;
  }

  public async set(id: string, data: Partial<T>): Promise<void> {
    await this.collection.doc(id).set(data);
  }

  public async update(
    id: string,
    data: Partial<T>
  ): Promise<firebaseAdmin.firestore.WriteResult> {
    return await this.collection.doc(id).update(data);
  }

  public async delete(
    id: string
  ): Promise<firebaseAdmin.firestore.WriteResult> {
    return await this.collection.doc(id).delete();
  }

  public async all(): Promise<T[]> {
    return await this.where([]);
  }

  public async exist(conditions: FilterCondition[]): Promise<boolean> {
    const result = await this.where(conditions, 1);
    return !!(result.length > 0);
  }

  public async where(
    conditions: FilterCondition[],
    limit?: number,
    orderBy?: OrderCondition
  ): Promise<T[]> {
    let query = this
      .collection as firebaseAdmin.firestore.Query<firebaseAdmin.firestore.DocumentData>;

    for (const condition of conditions) {
      query = query.where(condition.field, condition.op, condition.value);
    }

    orderBy && (query = query.orderBy(orderBy.field, orderBy.direction));
    limit && (query = query.limit(limit));

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => {
      // eslint-disable-next-line
      return { id: doc.id, ...doc.data() } as any;
    });
  }
}
