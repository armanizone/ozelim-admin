/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hvk5gew9vvnracu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cndyg8sw",
    "name": "agent",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "chqbwa938e4n1rd",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hvk5gew9vvnracu")

  // remove
  collection.schema.removeField("cndyg8sw")

  return dao.saveCollection(collection)
})