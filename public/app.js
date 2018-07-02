const socket = io();

const client = feathers();

client.configure(feathers.socketio(socket));

client.configure(feathers.authentication({
    storage: window.localStorage
}));

// Login screen
const loginHTML = `<main class="login container">
<div class="row">
  <div class="col-12 col-6-tablet push-3-tablet text-center heading">
    <h1 class="font-100">Log in or signup</h1>
  </div>
</div>
<div class="row">
  <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
    <form class="form">
      <fieldset>
        <input class="block" type="email" name="email" placeholder="email">
      </fieldset>

      <fieldset>
        <input class="block" type="password" name="password" placeholder="password">
      </fieldset>

      <button type="button" id="login" class="button button-primary block signup">
        Log in
      </button>
    
      <button type="button" id="showSign" class="button button-primary block signup">
        Sign Up
      </button>
     
    </form>
  </div>
</div>
</main>`;

const signupHTML = `<main class="login container">
<div class="row">
  <div class="col-12 col-6-tablet push-3-tablet text-center heading">
    <h1 class="font-100"Signup</h1>
  </div>
</div>
<div class="row">
  <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
    <form class="form">
      <fieldset>
        <input class="block" type="email" name="email" placeholder="email">
      </fieldset>

      <fieldset>
        <input class="block" type="password" name="password" placeholder="password">
      </fieldset>

      <fieldset>
        <input class="block" type="text" name="first_name" placeholder="First Name">
      </fieldset>

      <fieldset>
        <input class="block" type="text" name="last_name" placeholder="Last Name">
      </fieldset>
      

      <button type="button" id="signup" class="button button-primary block signup">
        Sign up and log in
      </button>
    </form>
  </div>
</div>
</main>`;

const userHTML = `<main class="flex flex-column">
<header class="title-bar flex flex-row flex-center">
<div class="title-wrapper block center-element">
  <img class="logo" src="http://feathersjs.com/img/feathers-logo-wide.png"
    alt="Feathers Logo">
  <span class="title">Users</span>
</div>
</header>
<div class="flex flex-row flex-1 clear">
<aside class="sidebar col col-3 flex flex-column flex-space-between">
      <header class="flex flex-row flex-center">
        <h4 class="font-300 text-center">
          <span class="font-600 online-count">0</span> users
        </h4>
      </header>

      <ul class="flex flex-column flex-1 list-unstyled user-list"></ul>
      <footer class="flex flex-row flex-center">
        <a href="#" id="logout" class="button button-primary">
          Sign Out
        </a>
      </footer>
    </aside>
    </div>
</main>`;

const addUser = user => {
    const userList = document.querySelector('.user-list');
    if(userList){
        userList.insertAdjacentHTML('beforeend',`<li>
        <a class="block relative" href="#">
          <img src="${user.avatar}" alt="" class="avatar">
          <span class="absolute username">${user.email}</span>
        </a>
      </li>`);

      const userCount = document.querySelectorAll('.user-list li').length;
      document.querySelectorAll('.online-count').innerHTML = userCount;
    }
};

const showLogin = (error = {}) => {
    if(document.querySelectorAll('.login').length){
        document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p>There was an error: ${error.message}</p>`);
    } else {
        document.getElementById('app').innerHTML = loginHTML;
    }
};

const showSignup = (error = {})=> {
    document.getElementById('app').innerHTML = signupHTML;
};

const showUsers = async () => {
    document.getElementById('app').innerHTML = userHTML;

    const users = await client.service('users').find();
    users.data.forEach(addUser);
};

const getCredentials = () => {
    const user = {
        email: document.querySelector('[name=email]').value,
        password: document.querySelector('[name=password]').value
    };
    return user;
}

const login = async credentials => {
    try {
        if(!credentials){
            await client.authenticate();
        } else {
            const payload = Object.assign({strategy: 'local'}, credentials);
            await client.authenticate(payload);
        }

        showUsers();
    } catch (error) {
        showLogin(error);
    }
};


document.addEventListener('click', async ev => {
    switch(ev.target.id){
        case 'signup': {
            // For signup, create a new user and then log them in
            const credentials = getCredentials();

            // First create the user
            await client.service('users').create(credentials);
            // If successful log them in
            await login(credentials);

            break;
        }
        case 'login': {
            const user = getCredentials();

            await login(user);

            break;
        }
        case 'logout': {
            await client.logout();

            document.getElementById('app').innerHTML = loginHTML;

            break;
        }
        case 'showSign': {
            document.getElementById('app').innerHTML = signupHTML;
        }
    }
});

client.service('users').on('created', addUser);

login();

