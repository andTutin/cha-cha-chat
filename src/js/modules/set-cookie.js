export default function (name, value, maxage) {
    document.cookie = `${name}="${value}";  max-age=${maxage}`; 
}