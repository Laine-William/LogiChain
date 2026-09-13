class BaseEntity {

  constructor(data = {}) {
    
    if (this.constructor === BaseEntity) {
        
        throw new Error("Classe abstraite");
    }

    this.id = data._id || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

module.exports = BaseEntity;