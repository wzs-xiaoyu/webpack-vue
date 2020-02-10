export const timeRange = function(startTime, endTime) {
  startTime = new Date(startTime);
  endTime = new Date(endTime);
  let [year, month, day, hours, minutes, seconds] = [startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes(), startTime.getSeconds()];
  let rangeObj = {
    year: endTime.getFullYear() - year,
    month: endTime.getMonth() - month,
    day: endTime.getDate() - day,
    hours: endTime.getHours() - hours,
    minutes: endTime.getMinutes() - minutes,
    seconds: endTime.getSeconds() - seconds
  };
  rangeObj.moment = `${year}-${month + 1 > 9 ? month + 1 : "0" + (month + 1)}-${day > 9 ? day : "0" + day} ${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}`;
  return rangeObj;
};
