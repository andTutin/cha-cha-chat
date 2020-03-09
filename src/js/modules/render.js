export default {
    message:   data => {
        return `<div class="message">
                    <div class="message__photo">
                        <div class="white"></div>
                    </div>
                    <div class="message__body">
                        <div class="message__text"> ${data.message}</div>
                        <div class="message__time"> ${data.time}</div>
                        <div class="message__arrow">
                            <div></div>
                        </div>
                    </div>
                </div>`
    },
    client:  client => {
        return `<li class="users__item">
                    <div class="user-card">
                        <div class="user-card__avatar">
                            <img src="${client.photo}">
                        </div>
                        <div class="user-card__info">
                            <div class="user-card__username">${client.fio}</div>
                            <div class="user-card__nickname">${client.nickname}</div>
                        </div>
                    </div>
                </li>`
    }  
}