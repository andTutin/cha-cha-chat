export default {
    set: (name, value, maxAge) => {
        document.cookie = `${name}="${value}";  max-age=${maxAge}`;
    },
    get: name =>  (document.cookie.indexOf(name) != -1) ? true : false
}