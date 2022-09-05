import { Request, Response } from 'express';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import bcrypt from 'bcrypt';
import { db } from '../services/firestore';

export async function checkUsername(req: Request, res: Response) {
  const { username } = req.body;

  try {
    const userRef = doc(db, `users`, username);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    if (!userData) {
      return res.status(200).send(true);
    }

    return res.status(200).send(false);
  } catch (error) {
    return res.status(500).send('Ocorreu um erro ao buscar o usuário');
  }
}

export async function getUserData(req: Request, res: Response) {
  const { username } = req.params;

  try {
    const userRef = doc(db, `users`, username);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    if (!userData) {
      return res.status(404).send('O usuário especificado não foi encontrado');
    }

    const formattedUserData = {
      name: userData.name,
      username: userData.username,
      createdAt: userData.createdAt.toDate(),
      updatedAt: userData.updatedAt.toDate(),
    };

    return res.status(200).send(formattedUserData);
  } catch (error) {
    return res.status(500).send('Ocorreu um erro ao buscar o usuário');
  }
}

export async function addUser(req: Request, res: Response) {
  const { username, name, password } = req.body;
  const userDoc = doc(db, 'users', username);

  // Checks if username is available
  const userSnapshot = await getDoc(userDoc);
  const userExists = userSnapshot.data();
  if (userExists) {
    return res.status(403).send('Username já está em uso');
  }

  // Hide user password
  const securePassword = await bcrypt.hash(password, 8);

  try {
    await setDoc(userDoc, {
      username,
      name,
      password: securePassword,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return res.status(201).send('Usuário criado com sucesso');
  } catch (error) {
    return res.status(500).send('Ocorreu um erro ao criar o usuário');
  }
}

export async function updateUser(req: Request, res: Response) {
  const { username } = req.params;

  const { name } = req.body;

  try {
    const userRef = doc(db, 'users', username);
    const userSnapshot = await getDoc(userRef);
    const userExists = userSnapshot.data();
    if (!userExists) {
      return res.status(404).send('O usuário especificado não foi encontrado');
    }

    // Optional fields for update
    const updatedData = {
      ...(name && { name }),
      updatedAt: serverTimestamp(),
    };
    await updateDoc(userRef, updatedData);

    return res.status(200).send('Usuário atualizado com sucesso');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return res
      .status(500)
      .send(`Ocorreu um erro ao atualizar o usuário: ${error.message}`);
  }
}

export async function deleteUser(req: Request, res: Response) {
  const { username } = req.params;

  try {
    // Removes all user entries
    const entriesRef = collection(db, `users/${username}/entries`);
    const entriesSnaphot = await getDocs(entriesRef);
    entriesSnaphot.docs.forEach((item) => {
      const docRef = doc(db, `users/${username}/entries`, item.id);
      deleteDoc(docRef);
    });

    // Deletes user account
    const userRef = doc(db, 'users', username);
    const userSnapshot = await getDoc(userRef);
    const userExists = userSnapshot.data();
    if (!userExists) {
      return res.status(404).send('O usuário especificado não foi encontrado');
    }
    await deleteDoc(userRef);

    return res.status(200).send('Usuário removido com sucesso');
  } catch (error) {
    return res.status(500).send('Ocorreu um erro ao remover o usuário');
  }
}
