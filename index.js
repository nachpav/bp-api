const axios = require('axios');
const qs = require('qs');
const _ = require('lodash');
const fs = require("fs");
const FormData = require("form-data");
const mime = require('mime-types')
const path = require('path')


class BP {
  constructor(domen, login, password, protocol = "https", timeout = 30000) {
    if (!domen) throw new Error(`domen can't be empty`);
    if (!login) throw new Error(`login can't be empty`);
    if (!password) throw new Error(`password can't be empty`);

    this.login = login;
    this.password = password;
    this.timeout = timeout;
    this.baseUrl = `${protocol}://${domen}/api/v1`;
  }

  _getUrl(opt) {
    switch (opt.resource) {
      case "record":
        return `${this.baseUrl}/catalogs/${opt.catalogId}/records/${
          opt.recordId ? opt.recordId : ""
        }`;
      case "catalog":
        return `${this.baseUrl}/catalogs/${opt.catalogId ? opt.catalogId : ""}`;
      case "section":
        return `${this.baseUrl}/sections/${opt.sectionId}`;
      case "view":
        return `${this.baseUrl}/catalogs/${opt.catalogId}/views/${opt.viewId}`;
      case "board":
        return `${this.baseUrl}/boards/${opt.boardId}/widgets/${opt.widgetId}/${opt.type}`;
      case "histories":
        return `${this.baseUrl}/histories`;
      case "relations":
        return `${this.baseUrl}/catalogs/${opt.catalogId}/records/${opt.recordId}/relations`;
      case "file":
        return `${this.baseUrl}/files/`;
    }
  }
  async _request(url, method, data = {}, params = {}) {
    return await axios({
      auth: {
        username: this.login,
        password: this.password,
      },
      timeout: this.timeout,
      url: url,
      method: method,
      params: params,
      paramsSerializer: function (params) {
        return qs.stringify(params);
      },
      headers: {
        "Content-type": "application/json",
      },
      data: data,
    });
  }

  async getRecordById(catalogId, recordId, params = {}) {
    if (!recordId) throw new Error(`recordId is required`);
    if (!catalogId) throw new Error(`catalogId is required`);
    let url = this._getUrl({
      resource: "record",
      catalogId: catalogId,
      recordId: recordId,
    });
    let response = await this._request(url, "GET", undefined, params);
    return response.data;
  }
  async getRecords(catalogId, params = {}) {
    if (!catalogId) throw new Error(`catalogId is required`);
    let url = this._getUrl({
      resource: "record",
      catalogId: catalogId,
      recordId: "",
    });
    let response = await this._request(url, "GET", undefined, params);
    return response.data;
  }
  async getCatalog(catalogId = "") {
    let url = this._getUrl({ resource: "catalog", catalogId: catalogId });
    let response = await this._request(url, "GET");
    return response.data;
  }
  async getSection(sectionId = "") {
    let url = this._getUrl({ resource: "section", sectionId: sectionId });
    let response = await this._request(url, "GET");
    return response.data;
  }
  async getView(catalogId, viewId = "") {
    if (!catalogId) throw new Error(`catalogId is required`);
    let url = this._getUrl({
      resource: "view",
      viewId: viewId,
      catalogId: catalogId,
    });
    let response = await this._request(url, "GET");
    return response.data;
  }
  async getWidget(boardId, params = {}, widgetId = "new", type = "values") {
    if (!boardId) throw new Error(`boardId is required`);
    let url = this._getUrl({
      resource: "board",
      boardId: boardId,
      widgetId: widgetId,
      type: type,
    });
    let response = await this._request(url, "GET", undefined, params);
    return response.data;
  }
  async getHistory(catalogId, recordId = "") {
    if (!catalogId) throw new Error(`catalogId is required`);
    let params = {};
    if (recordId) params.recordId = recordId;
    params.catalogId = catalogId;
    let url = this._getUrl({ resource: "histories" });
    let response = await this._request(url, "GET", undefined, params);
    return response.data;
  }
  async getRelations(catalogId, recordId, params = {}) {
    if (!catalogId) throw new Error(`catalogId is required`);
    if (!recordId) throw new Error(`recordId is required`);
    let url = this._getUrl({
      resource: "relations",
      catalogId: catalogId,
      recordId,
      recordId,
    });
    let response = await this._request(url, "GET", undefined, params);
    return response.data;
  }
  async postRecord(catalogId, data = {}) {
    if (!catalogId) throw new Error(`catalogId is required`);
    if (typeof data != "object") throw new Error(`data must be an object`);
    let url = this._getUrl({ resource: "record", catalogId: catalogId });
    let response = await this._request(url, "POST", { values: data });
    return response.data;
  }
  async postCatalog(data = {}) {
    if (typeof data != "object") throw new Error(`data must be an object`);
    if (_.isEmpty(data)) throw new Error(`data cant't be empty`);
    let url = this._getUrl({ resource: "catalog" });
    let response = await this._request(url, "POST", data);
    return response.data;
  }
  async postSection(data = {}) {
    if (typeof data != "object") throw new Error(`data must be an object`);
    if (_.isEmpty(data)) throw new Error(`data cant't be empty`);
    let url = this._getUrl({ resource: "section" });
    let response = await this._request(url, "POST", data);
    return response.data;
  }
  async patchRecord(catalogId, recordId, data = {}) {
    if (!catalogId) throw new Error(`catalogId is required`);
    if (!recordId) throw new Error(`recordId is required`);
    if (typeof data != "object") throw new Error(`data must be an object`);
    if (_.isEmpty(data)) throw new Error(`data cant't be empty`);
    let url = this._getUrl({
      resource: "record",
      catalogId: catalogId,
      recordId: recordId,
    });
    let response = await this._request(url, "PATCH", { values: data });
    return response.data;
  }
  async patchCatalog(catalogId, data = {}) {
    if (!catalogId) throw new Error(`catalogId is required`);
    if (typeof data != "object") throw new Error(`data must be an object`);
    if (_.isEmpty(data)) throw new Error(`data cant't be empty`);
    let url = this._getUrl({ resource: "catalog", catalogId: catalogId });
    let response = await this._request(url, "PATCH", data);
    return response.data;
  }
  async patchSection(sectionId, data = {}) {
    if (!catalogId) throw new Error(`sectionId is required`);
    if (typeof data != "object") throw new Error(`data must be an object`);
    if (_.isEmpty(data)) throw new Error(`data cant't be empty`);
    let url = this._getUrl({ resource: "section", sectionId: sectionId });
    let response = await this._request(url, "PATCH", data);
    return response.data;
  }
  async deleteRecord(catalogId, recordId) {
    if (!catalogId) throw new Error(`catalogId is required`);
    if (!recordId) throw new Error(`recordId is required`);
    let url = this._getUrl({
      resource: "record",
      catalogId: catalogId,
      recordId: recordId,
    });
    let response = await this._request(url, "DELETE");
    return response.data;
  }
  async deleteCatalog(catalogId) {
    console.log(`function is disabled!`);
    return;
    if (!catalogId) throw new Error(`catalogId is required`);
    let url = this._getUrl({ resource: "record", catalogId: catalogId });
    let response = await this._request(url, "DELETE");
    return response.data;
  }
  async deleteSection(sectionId) {
    console.log(`function is disabled!`);
    return;
    if (!catalogId) throw new Error(`sectionId is required`);
    let url = this._getUrl({ resource: "section", sectionId: sectionId });
    let response = await this._request(url, "DELETE");
    return response.data;
  }

  async getAllRecords(catalogId, params = {}, maxLimit = 5000) {
    if (!catalogId) throw new Error(`catalogId is required`);
    if (!params.limit) params.limit = 1000;
    if (!params.offset) params.offset = 0;
    let records = { length: params.limit };
    let totalRecords = [];
    if (records.length == params.limit) {
      while (records.length > 0 && totalRecords.length < maxLimit) {
        records = await this.getRecords(catalogId, params);
        params.offset += params.limit;
        totalRecords = _.concat(totalRecords, records);
      }
    }
    return totalRecords;
  }

    //в обьекте params должны быть ключи:    
    //   filePath - путь к файлу 
    //   name - имя файла в записи. Если параметр не указан - возьмёт имя файла из параметра filePath
  async postFile(catalogId, fieldId, params = {}) {
    if (!catalogId) throw new Error(`catalogId is required`);
    if (!fieldId) throw new Error(`fieldId is required`);    
    if (!params.filePath) throw new Error(`params.filePath is required`);
    if (!params.name) {
      params.name = path.basename(params.filePath)
    }    
    let urlFile = this._getUrl({ resource: "file" });
    let dataPostToBpium = { 
        catalogId: catalogId,
        fieldId: fieldId,
        "name": params.name, 
        "typeStorage": "remoteStorage" 
    };
    let fileDataFromBpiumJSON = await this._request(urlFile, "POST", dataPostToBpium);
    let file = fs.createReadStream(params.filePath);
    let formData = new FormData();
    formData.append("key", fileDataFromBpiumJSON.fileKey);
    formData.append("acl", "private");
    formData.append("AWSAccessKeyId", fileDataFromBpiumJSON.AWSAccessKeyId);
    formData.append("Policy", fileDataFromBpiumJSON.police);
    formData.append("Signature", fileDataFromBpiumJSON.signature);
    formData.append("Content-Type", mime.lookup(params.filePath));
    formData.append("file", file);
    let formHeaders = formData.getHeaders();
    await formData.getLength(async function (err, length) {
      if (err) {
        this._error(err);
        return;
      };
      await axios({
        method: "POST",
        url: fileDataFromBpiumJSON.uploadUrl,
        data: formData,
        headers: {
          ...formHeaders,
          "Content-Length": length,
        }
      });
    })
    let paramsForWriteRecord ={}
    paramsForWriteRecord[fieldId] = [{
        id: fileDataFromBpiumJSON.fileId
    }]  
    await this.postRecord(catalogId, paramsForWriteRecord)
  }

  async pause(timer = 500) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve();
      }, timer);
    });
  }
}

module.exports = BP;