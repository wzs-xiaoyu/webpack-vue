import JSZip from "jszip";

export const getGitInfo = function(zipfile) {
  return new Promise(rs => {
    let fReader = new FileReader();
    fReader.onload = function() {
      JSZip.loadAsync(this.result).then(function(zip) {
        let gitInfoFile = zip.file("index.html");
        if (!gitInfoFile) return rs("");
        gitInfoFile.async("string").then(function(data) {
          let rg = /<!--AGCP_gitInfo@(.*)-->/g;
          let gitInfo = rg.exec(data) || ["", ""];
          rs(gitInfo[1].trim());
        });
      });
    };
    fReader.readAsArrayBuffer(zipfile);
  });
};

export const ajaxFile = function(url) {
  let ajaxObj = new XMLHttpRequest();
  ajaxObj.open("get", url);
  ajaxObj.send();
  return new Promise((rs, rj) => {
    ajaxObj.onreadystatechange = function() {
      if (ajaxObj.readyState == 4) {
        ajaxObj.status == 200 && rs(ajaxObj.responseText);
        ajaxObj.status != 200 && rj(ajaxObj);
      }
    };
  });
};
