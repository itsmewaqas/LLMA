import * as SQLite from 'expo-sqlite';
import { SECTION_LIST_MOCK_DATA } from './utils';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems({ menu }) {
  db.transaction((tx) => {
    try {
      var itemsarr = menu
        .map(
          (item) =>
            ` ('${item.id}','${item.title}','${item.price}','${item.category.title}') `
        )
        .join(' ,');
      tx.executeSql(
        `insert into menuitems (uuid,title,price,category) values ${itemsarr}`
      );
    } catch (error) {
      console.log('DB ERROR ::: ', error);
    }
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  var items = await getMenuItems();
  return new Promise((resolve, reject) => {
    // resolve(item)
    var filteredArr = items.filter((item) => {
      return activeCategories.includes(item.category);
    });
    filteredArr = filteredArr.filter((item) => {
      return item.title.includes(query);
    });
    resolve(filteredArr);
  });
}
