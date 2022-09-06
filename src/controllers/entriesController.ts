import { Request, Response } from 'express';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../services/firestore';
import { decrypt, encrypt } from '../utils/crypto';

interface CustomReq extends Request {
  username: string;
}

export async function getEntryFromUser(req: Request, res: Response) {
  const { username } = req as CustomReq;
  const { id } = req.params;

  try {
    const entryRef = doc(db, `/users/${username}/entries`, id);
    const entrySnapshot = await getDoc(entryRef);
    const entryData = entrySnapshot.data();
    if (!entryData) {
      return res.status(404).send('O registro especificado não foi encontrado');
    }

    // Decrypts data from db
    const { title, description, tag, type, value, createdAt, updatedAt } =
      entryData;

    const decryptedTitle = decrypt(title);
    const decryptedDescription = decrypt(description);
    const decryptedTag = decrypt(tag);
    const decryptedType = decrypt(type);
    const decryptedValue = decrypt(value);

    const formattedEntryData = {
      id: entrySnapshot.id,
      title: decryptedTitle,
      description: decryptedDescription,
      tag: decryptedTag,
      type: decryptedType,
      value: decryptedValue,
      createdAt: createdAt.toDate(),
      updatedAt: updatedAt.toDate(),
    };

    return res.status(200).send(formattedEntryData);
  } catch (error) {
    return res
      .status(500)
      .send('Ocorreu um erro ao buscar o registro do usuário');
  }
}

export async function getAllEntriesFromUser(req: Request, res: Response) {
  const { username } = req as CustomReq;

  try {
    const entriesRef = collection(db, `/users/${username}/entries`);
    const entriesSnapshot = await getDocs(entriesRef);
    const entriesList = entriesSnapshot.docs.map((item) => {
      // Decrypts data from db
      const { title, description, tag, type, value, createdAt, updatedAt } =
        item.data();
      const decryptedTitle = decrypt(title);
      const decryptedDescription = decrypt(description);
      const decryptedTag = decrypt(tag);
      const decryptedType = decrypt(type);
      const decryptedValue = decrypt(value);

      return {
        id: item.id,
        title: decryptedTitle,
        description: decryptedDescription,
        tag: decryptedTag,
        type: decryptedType,
        value: decryptedValue,
        createdAt: createdAt.toDate(),
        updatedAt: updatedAt.toDate(),
      };
    });

    return res.status(200).send(entriesList);
  } catch (error) {
    return res
      .status(500)
      .send('Ocorreu um erro ao buscar os registros do usuário');
  }
}

export async function createEntry(req: Request, res: Response) {
  const { username } = req as CustomReq;
  const { title, description, tag, type, value } = req.body;

  // Encrypts data for db
  const encryptedTitle = encrypt(title);
  const encryptedDescription = encrypt(description);
  const encryptedTag = encrypt(tag);
  const encryptedType = encrypt(type);
  const encryptedValue = encrypt(value.toString());

  try {
    const entryRef = collection(db, `users/${username}/entries`);
    await addDoc(entryRef, {
      title: encryptedTitle,
      description: encryptedDescription,
      tag: encryptedTag,
      type: encryptedType,
      value: encryptedValue,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return res.status(201).send('Registro criado com sucesso');
  } catch (error) {
    return res.status(500).send('Ocorreu um erro na criação do registro');
  }
}

export async function updateEntry(req: Request, res: Response) {
  const { username } = req as CustomReq;
  const { id } = req.params;
  const { title, description, tag, type, value } = req.body;

  try {
    const entryRef = doc(db, `users/${username}/entries`, id);
    const entrySnapshot = await getDoc(entryRef);
    const entryExists = entrySnapshot.data();
    if (!entryExists) {
      return res.status(404).send('O registro especificado não foi encontrado');
    }

    const encryptedTitle = encrypt(title);
    const encryptedDescription = encrypt(description);
    const encryptedTag = encrypt(tag);
    const encryptedType = encrypt(type);
    const encryptedValue = encrypt(value.toString());

    const updatedData = {
      ...(title && { title: encryptedTitle }),
      ...(description && { description: encryptedDescription }),
      ...(tag && { tag: encryptedTag }),
      ...(type && { type: encryptedType }),
      ...(value && { value: encryptedValue }),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(entryRef, updatedData);

    return res.status(201).send('Registro atualizado com sucesso');
  } catch (error) {
    return res.status(500).send('Ocorreu um erro na atualização do registro');
  }
}

export async function deleteEntry(req: Request, res: Response) {
  const { username } = req as CustomReq;
  const { id } = req.params;

  try {
    const entryRef = doc(db, `users/${username}/entries`, id);
    const entrySnapshot = await getDoc(entryRef);
    const entryExists = entrySnapshot.data();
    if (!entryExists) {
      return res.status(404).send('O registro especificado não foi encontrado');
    }

    await deleteDoc(entryRef);

    return res.status(200).send('Registro removido com sucesso');
  } catch (error) {
    return res.status(500).send('Ocorreu um erro ao remover o registro');
  }
}
