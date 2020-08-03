import fetch from 'node-fetch';
import { State, Pet, PetLocation } from './types';

export class SurePetCareClient {
  private token = '';
  private readonly baseUrl = 'https://app.api.surehub.io';

  public authenticate = async (email: string, password: string) => {
    const resp = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email_address: email, password, device_id: '.' }),
      headers: {'Content-Type': 'application/json'},
    });

    if (!resp.ok) {
      switch (resp.status) {
        case 401:
          throw new Error('Authentication failed: invalid credentials');
        default:
          throw new Error(`Authentication failed: received ${resp.status} ${resp.statusText}`);
      }
    }

    const token = resp.headers.get('Authorization');

    if (token === null) {
      throw new Error('Authentication failed: no authorization token in response');
    }

    this.token = token;
  }

  private getState = async (): Promise<State> => {
    const resp = await fetch(`${this.baseUrl}/api/me/start`, {
      headers: {'Content-Type': 'application/json', 'Authorization': this.token },
    });

    if (!resp.ok) {
      switch (resp.status) {
        case 401:
          throw new Error('Get state failed: unauthenticated');
        default:
          throw new Error(`Get state failed: received ${resp.status} ${resp.statusText}`);
      }
    }

    return resp.json();
  }

  public getPets = async (): Promise<Pet[]> => {
    const state = await this.getState();

    return state.pets;
  }

  public getPetByName = async (name: string): Promise<Pet> => {
    const pets = await this.getPets();

    const pet = pets.find((p) => p.name === name);

    if (!pet) {
      throw new Error('Pet not found');
    }

    return pet;
  }

  public getPetById = async (id: number): Promise<Pet> => {
    const pets = await this.getPets();

    const pet = pets.find((p) => p.id === id);

    if (!pet) {
      throw new Error('Pet not found');
    }

    return pet;
  }

  public setPetLocation = async (id: number, location: PetLocation, since = new Date()): Promise<void> => {
    const date = since.toISOString();
    const resp = await fetch(`${this.baseUrl}/api/pet/${id}/position`, {
      method: 'POST',
      body: JSON.stringify({ since: date, where: location }),
      headers: {'Content-Type': 'application/json', 'Authorization': this.token },
    });

    if (!resp.ok) {
      switch (resp.status) {
        case 401:
          throw new Error('Set pet location failed failed: invalid credentials');
        default:
          throw new Error(`Set pet location failed failed: received ${resp.status} ${resp.statusText}`);
      }
    }
  }
}
