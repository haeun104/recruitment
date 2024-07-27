export const getFormattedDate = (timeStamp: number) => {
  const date = new Date(timeStamp);
  const year = date.getFullYear();
  let month: number | string = date.getMonth() + 1;
  let day: number | string = date.getDate();
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }

  return `${day}/${month}/${year}`;
};

export const currentUser = 'haniakim';