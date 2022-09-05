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

    const formattedEntryData = {
      ...entryData,
      id: entrySnapshot.id,
      createdAt: entryData.createdAt.toDate(),
      updatedAt: entryData.updatedAt.toDate(),
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
      return {
        ...item.data(),
        id: item.id,
        createdAt: item.data().createdAt.toDate(),
        updatedAt: item.data().updatedAt.toDate(),
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

  try {
    const entryRef = collection(db, `users/${username}/entries`);
    await addDoc(entryRef, {
      title,
      description,
      tag,
      type,
      value,
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

    const updatedData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(tag && { tag }),
      ...(type && { type }),
      ...(value && { value }),
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
