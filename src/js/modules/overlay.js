import render from './render';
import queries from './queries';

let { overlay } = queries;

export default {
    openAuth: () => {
        overlay.classList.add('open');
        overlay.innerHTML = render.auth();

    },
    openUser: client => {
        overlay.classList.add('open');
        overlay.innerHTML = render.user(client);
    },
    close: () => {
        overlay.innerHTML = '';
        overlay.classList.remove('open');
    },
    closeOnClick: () => {
        overlay.addEventListener('click', e => {
            if (e.target.className == 'overlay open') {
                overlay.innerHTML = '';
                overlay.classList.remove('open');
            }

        })
    }
}