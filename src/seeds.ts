import { faker } from '@faker-js/faker';
import axios from 'axios';
import { createCanvas } from 'canvas';
import dotenv from 'dotenv';
import { random, uniq } from 'lodash';

dotenv.config({});

function avatarColor(): string {
  const colors = uniq([
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
    '#9E9E9E',
    '#607D8B',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39'
  ]);
  return colors[Math.floor(random(colors.length))];
}

function generateAvatar(text: string, backgroundColor: string, foregroundColor = 'white') {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'normal 80px sans-serif';
  ctx.fillStyle = foregroundColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL('image/png');
}

async function seedUserData(count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    try {
      const username = faker.unique(faker.word.adjective, [8]);
      const color = avatarColor();
      const avatar = generateAvatar(username.charAt(0).toUpperCase(), color);

      const body = {
        username,
        email: faker.internet.email(),
        password: 'qwerty',
        avatarColor: color,
        avatarImage: avatar
      };

      console.log(`***ADDING USER TO DATABASE*** - ${i} of ${count} - ${username}`);
      await axios.post(`${process.env.API_URL}/signup`, body);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }
}

seedUserData(20);
