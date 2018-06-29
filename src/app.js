import $ from 'jquery';
import { createStore } from 'redux';
import { getFeedsList } from './storage';
import reducers from './reducers/reducers';
import updateState from './stateUpdater';
import isInputValid from './validator';
import updateFeeds from './feedsUpdater';
import * as actions from './actions';

function modalCallback(event) {
  const modal = $('#modal');
  const button = $(event.relatedTarget);
  const link = button.prev();
  const title = link.children()[0].innerText;
  const description = link.children()[1].innerText;
  modal.find('.modal-title').text(title);
  modal.find('.modal-body').text(description);
}

export default () => {
  const ext = window.__REDUX_DEVTOOLS_EXTENSION__;
  const devtoolMiddleware = ext && ext();

  const store = createStore(
    reducers,
    devtoolMiddleware,
  );

  const feedsFromStorage = getFeedsList();

  store.dispatch(actions.updateFeedsList(feedsFromStorage));
  store.dispatch(actions.addFeedsToRender(feedsFromStorage));

  const input = document.querySelector('input');
  const button = document.querySelector('button');

  const toggleInputStyle = {
    valid: () => {
      input.classList.remove('is-invalid');
      store.dispatch(actions.validateInput());
    },
    invalid: () => {
      input.classList.add('is-invalid');
      store.dispatch(actions.rejectInput());
    },
  };

  input.addEventListener('input', () => {
    const validInput = isInputValid(input.value);

    if (validInput || input.value === '') {
      toggleInputStyle.valid();
    } else {
      toggleInputStyle.invalid();
    }
  });

  button.addEventListener('click', (event) => {
    event.preventDefault();

    const state = store.getState();
    if (state.validInput) {
      button.disabled = true;
      updateState(store);
    }
  });

  const exampleLink = document.querySelector('.example');
  exampleLink.addEventListener('click', (event) => {
    event.preventDefault();

    store.dispatch(actions.validateInput());
    input.value = exampleLink.href;
    toggleInputStyle.valid();
  });

  $('[data-toggle="tooltip"]').tooltip();

  $('#modal').on('show.bs.modal', modalCallback);

  updateState(store);
  setTimeout(() => updateFeeds(store), 5000);
};

// export default () => {
//   const state = new State();

//   const input = document.querySelector('input');
//   const button = document.querySelector('button');

//   const toggleInputStyle = {
//     valid: () => {
//       input.classList.remove('is-invalid');
//       button.disabled = false;
//     },
//     invalid: () => {
//       input.classList.add('is-invalid');
//       button.disabled = true;
//     },
//   };

//   input.addEventListener('input', () => {
//     state.validInput = isInputValid(state);

//     if (state.validInput || input.value === '') {
//       toggleInputStyle.valid();
//     } else {
//       toggleInputStyle.invalid();
//     }
//   });

//   button.addEventListener('click', (event) => {
//     event.preventDefault();
//     if (state.validInput) {
//       button.disabled = true;
//       updateState(state);
//     }
//   });

//   const exampleLink = document.querySelector('.example');
//   exampleLink.addEventListener('click', (event) => {
//     event.preventDefault();
//     input.value = exampleLink.href;
//     state.validInput = true;
//     toggleInputStyle.valid();
//   });

//   $('[data-toggle="tooltip"]').tooltip();

//   $('#modal').on('show.bs.modal', modalCallback);

//   updateState(state);
//   setTimeout(() => updateFeeds(state), 5000);
// };
