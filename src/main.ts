import './style.scss';
import { APP } from '@constants';
console.log(APP);

const app = document.querySelector<HTMLBRElement>('body');
app!.innerHTML = `
<h1>Hello world</h1>
`;
