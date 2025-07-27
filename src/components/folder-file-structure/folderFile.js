import React from "react";
import { explorer } from "./config";
import up from "./assets/up.svg";
import down from "./assets/down.svg";
import folderOpen from "./assets/folder-open.svg";
import folderClose from "./assets/folder-close.svg";
import file from "./assets/file.svg";
import fileAdd from "./assets/file-add.svg";
import folderAdd from "./assets/folder-add.svg";
import deleteIcon from "./assets/delete.svg";
import edit from "./assets/edit.svg";

const ShowStructure = ({
  id,
  name,
  isFolder,
  items,
  data,
  onDelete,
  onEdit,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showAddFile, setShowAddFile] = React.useState(false);
  const [showAddFolder, setShowAddFolder] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "4px",
          cursor: "pointer",
        }}
      >
        {isFolder && (
          <img src={isOpen ? down : up} onClick={() => handleToggle()} />
        )}
        {isFolder && <img src={isOpen ? folderOpen : folderClose} />}
        {!isFolder && <img src={file} />}

        {showEdit ? (
          <input
            autoFocus
            defaultValue={name}
            onBlur={() => setShowEdit(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.target.value.length > 0) {
                onEdit(id, event.target.value);
                setShowEdit(false)
              }
            }}
          />
        ) : (
          <div>{name}</div>
        )}
        <img src={folderAdd} onClick={() => setShowAddFolder(true)} />
        <img
          src={fileAdd}
          width="20px"
          height="20px"
          onClick={() => setShowAddFile(true)}
        />
        <img src={edit} onClick={() => setShowEdit(true)} />
        <img
          src={deleteIcon}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        />
      </div>
      {isOpen && (
        <div style={{ marginLeft: "20px" }}>
          {items.map((item) => (
            <div style={{ marginTop: "10px" }}>
              <ShowStructure
                key={item.id}
                {...item}
                data={items}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </div>
          ))}
        </div>
      )}
      {showAddFolder && (
        <input
          autoFocus
          style={{ marginLeft: "20px" }}
          onBlur={() => setShowAddFolder(false)}
          placeholder="Add Folder"
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.target.value.length > 0) {
              items.push({
                id: new Date().getTime(),
                name: event.target.value,
                isFolder: true,
                items: [],
              });
              setIsOpen(true);
              setShowAddFolder(false);
            }
          }}
        />
      )}
      {showAddFile && (
        <input
          autoFocus
          style={{ marginLeft: "20px" }}
          onBlur={() => setShowAddFile(false)}
          placeholder="Add File"
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.target.value.length > 0) {
              items.push({
                id: new Date().getTime(),
                name: event.target.value,
                isFolder: false,
                items: [],
              });
              setIsOpen(true);
              setShowAddFile(false);
            }
          }}
        />
      )}
    </>
  );
};
export default function FileFolderStructure() {
  const [showFiles, setShowFiles] = React.useState(false);
  const [data, setData] = React.useState(explorer);
  const [showAddFile, setShowAddFile] = React.useState(false);
  const [showAddFolder, setShowAddFolder] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const handleDelete = (tree, id) => {
    if (!tree.items) {
      return tree;
    }
    const filteredData = tree.items
      .filter((item) => item.id !== id)
      .map((val) => {
        if (val.isFolder) return handleDelete(val, id);
        else return val;
      });
    return { ...tree, items: filteredData };
  };
  const handleEdit = (tree, id, value) => {
    if (!tree.items) return tree;

    const updatedData = tree.items.map((item) => {
      if (item.id === id) {
        return { ...item, name: value };
      } else if (item.isFolder) return handleEdit(item, id, value);
      else return item;
    });
    return { ...tree, items: updatedData };
  };
  return (
    <>
      {Object.keys(data).length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "4px",
            cursor: "pointer",
          }}
        >
          <img
            src={showFiles ? down : up}
            onClick={() => {
              setShowFiles(!showFiles);
            }}
          />
          <img src={showFiles ? folderOpen : folderClose} />
          {!data.isFolder && <img src={file} />}
          <div>
            {!showEdit ? (
              data.name
            ) : (
              <input
                defaultValue={data.name}
                autoFocus
                onBlur={() => setShowEdit(false)}
                onChange={() => {}}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setData({ ...data, name: event.target.value });
                    setShowEdit(false);
                  }
                }}
              />
            )}
          </div>
          <img src={folderAdd} onClick={() => setShowAddFolder(true)} />
          <img
            src={fileAdd}
            width="20px"
            height="20px"
            onClick={() => setShowAddFile(true)}
          />
          <img
            src={edit}
            onClick={() => {
              setShowEdit(true);
            }}
          />
          <img
            src={deleteIcon}
            onClick={() => {
              setData({});
              setShowFiles(false);
            }}
          />
        </div>
      )}

      {showFiles && (
        <div style={{ marginLeft: "20px" }}>
          {data.items.map((item) => (
            <div style={{ marginTop: "10px" }}>
              <ShowStructure
                key={item.id}
                {...item}
                data={data.items}
                onDelete={(id) => {
                  const temp = handleDelete(data, id);
                  setData(temp);
                }}
                onEdit={(id, value) => {
                  const temp = handleEdit(data, id, value);
                  setData(temp);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {showAddFolder && (
        <input
          autoFocus
          style={{ marginLeft: "20px" }}
          onBlur={() => setShowAddFolder(false)}
          placeholder="Add Folder"
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.target.value.length > 0) {
              let temp = data.items;
              temp.push({
                id: new Date().getTime(),
                name: event.target.value,
                isFolder: true,
                items: [],
              });
              setData({ ...data, items: temp });
              setShowFiles(true);
            }
          }}
        />
      )}
      {showAddFile && (
        <input
          autoFocus
          style={{ marginLeft: "20px" }}
          onBlur={() => setShowAddFile(false)}
          placeholder="Add File"
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.target.value.length > 0) {
              let temp = data.items;
              temp.push({
                id: new Date().getTime(),
                name: event.target.value,
                isFolder: false,
                items: [],
              });
              setData({ ...data, items: temp });
              setShowFiles(true);
            }
          }}
        />
      )}
    </>
  );
}
