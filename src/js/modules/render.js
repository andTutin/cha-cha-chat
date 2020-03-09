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
    },
    auth: () => {
        return `<div class="auth">
                    <div class="auth__logo">
                        <div class="chat-logo"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAABCCAMAAAAR+GpLAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAX1QTFRFIy89LEFXPWGIR3OjSnquSnmsSnqtRG6bN1V2JjREKz1TQ2uYUYfBToC3O16DMEdhUIW+RXCeJjVGLUFYR3SkJDFATX+1PWCHOVl8JzdJO12COlt/Q2yZNlNyJjVFToK5L0dhQ22aLUJZT4O6JTNENVFwLUNbKDhKKDlLKDhLKDlMJzZHNlR1R3SlUIa/UYbAUYfARW+dLkNcKj1SJDJBS3uvSXeqMkxoQGaPO12BToK6Iy8+S3uuQGeQLEBWNE9tSXirJTJCM01qQmqVSHWnRnKhS3ywM01rNVJyNlNzQGeRKTtPSXiqP2SNPWGJM05rMUplPF6DP2SMSHaoToG4P2WOOFd5N1V1KTtQMEhiQWiSTYC3MUlkKjxRN1Z3LEBXRnGgTH2xNFBvMUpmQmuXPmKJOFh7IzA+JjZHKz5URG2bLEFYNFBuSHanSXmrSXepUIW9KTpOTYC2Kz9VKz9UPF6EJjRFNVJxQWmTQmqWR3WmQWmURnOiSHWmJDA/k4XiQAAAAodJREFUeJzt2P1f0kAcB/DLAUF98ynJgkoDSS2ZJEaoQRZpBhIkQUlKT5j2RNnz89/u7YaE293ubpOf4vN6OWH77P0aA+7GEBLIkR7F5ebH4z7q9Yl4Wo4dB/Gc6BVD+/olUJyBQQH0pJyJM8RH/aekVRjmqqflUYAzPHVIa/UHgoI5S9RzHPQ8eatG+GeqmVGiXuC0QqQVHhNVI6Tv5rQu2lJdnFZnjrWrdtWu2lX/H9U3PjFpyKXLzlTfVDSsTquGxK44UmcYU37UiRqnm/jSxoE6e5WlJhyo1/By2kO7cEw6UOe0vfysll01iZfzC6yWveuB6yhluVdaV5mvxZgbpL9IjpWt3gxrrXlRFN0iaoajogGtpd5WokJZWibqHZ66wvrcWWWMp+oXsHK5i7jq+IgsmkV8FeVW5dA8ElERuifxi2OxgARVNFu8n1wr6bs9KJeTxpTz+Tz+l1qrpJt7iKgkD3X1kUBVQg0SdJ22ab1aDcqp8WK7WqF28Aj1WE7dgNRmS83SOzV94pBQn+DtrjldfcroyKtkhFWQ9tvzmVZ7/uLQ1Dp+UIVJvJwB76GqWy8RGW9HRVTrUbtN3cZ/OyrAhuixsmcYhF5p6uvmkxz9E+sFKB1cEwDrGSTdGjFwBvHjN+bOW4B3B9cUQZu5G6z7PqtkdA/tt/Foq2TqhmTeAxi+WwsN/kCktNohRiNmvIUzwUU/7P5rR2K0xsdPprPy2W2NNuLt7d2VwBJeWe8d3k/Pl8JXyhvij1QThntrDQ8Bw+5S9pupXwD4TmFEUtHUH9RNU/DTJopQGau/qFu2VOG7geb81r9T5tT67KNoZ9n26bPKJvzpgIpqie1OsLm/9vbbA4gFqddnyOcjAAAAAElFTkSuQmCC" alt="cha-cha-chat"></div>
                    </div>
                    <h2 class="auth__title">Авторизация</h2>
                    <p>Введите пожалуйста своё фио и ник для дальнейшей авторизации</p>
                    <form class="auth__form">
                        <input class="auth__input" type="text" name="fio" placeholder="Введите свои ФИО..." required>
                        <input class="auth__input" type="text" name="nickname" placeholder="Введите свой ник..." required>
                        <button class="login-button" type="submit">Войти</button>
                    </form>
                    <div class="close">+</div>
                </div>`
    },
    user: user => {
        return `<div><div class="member-card">
                    <h3 class="member-card__title"> Загрузка фото </h3>
                    <div class="member-card__body">
                        <label class="member-card__avatar">
                            <img src=${user.avatar} alt=${user.fio}>
                            <input type="file" id="photo-input" style="width: 0">
                        </label>
                        <div class="member-card__info">
                            <div class="member-card__member"> ${user.fio} </div>
                            <div class="member-card__status"> В сети </div>
                        </div>
                    </div>
                </div>
                <div class="confirmation">
                    <div class="new-avatar">
                        <img src="" id="new-avatar__preview" alt=${user.fio}>
                    </div>
                    <div class="confirmation__btns">
                        <button id="reset-btn"> ОТМЕНА </button>
                        <button type="submit" id="submit-btn"> СОХРАНИТЬ </button>
                    </div></div>` 
    }

}