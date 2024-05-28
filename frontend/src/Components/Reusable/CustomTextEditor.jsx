import React, { useEffect, useState } from "react";
import Image from "./Image";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '../../ckEditor/ckeditor'
import ApiConstants from "../../Utils/ApiConstant";
import SessionManager from "../../Utils/Session";

function CustomTextEditor({
  name,
  labelTitle,
  defaultValue,
  setValue,
  icon,
  showError,
  errorMessage,
  updateValue,
  resetValue,
  setResetValue,
  showMandatory = false,
  ...props
}) {
  const [editor, setEditor] = useState();

  useEffect(() => {
    if (resetValue && editor) {
      setResetValue(false);
      editor.setData("");
    }
  }, [resetValue]);

  useEffect(() => {
    if (updateValue && editor) {
      editor.setData(updateValue);
    }
  }, [updateValue]);

  useEffect(() => {
    if (resetValue && editor) {
      setResetValue(false);
      editor.setData("");
    }
  }, [editor]);

  useEffect(() => {
    setValue(name, defaultValue)
  }, []);

  return (
    <div className="form-group mb-3 d-flex flex-column">
      <h3 className="login_heading">
        {labelTitle}{showMandatory ? <span className="danger">*</span> : null}
      </h3>
      <div className="position-relative">
        <Image src={icon} className="input_icons"></Image>
        <CKEditor
          {...props}
          editor={ClassicEditor}
          config={{
            extraPlugins: [ThisCustomUploadAdapterPlugin]
          }}
          data={defaultValue}
          onReady={editor => {
            setEditor(editor);
          }}
          onChange={(e) => {
            if (e.name == "change:data")
              setValue(`${name}`, editor.getData(), { shouldValidate: !resetValue })
          }}
        />
      </div>

      {showError ? <span className="danger fs-14 fw-400 mt-1">{errorMessage}</span> : null}
    </div>
  );
}

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    const formData = new FormData();
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          formData.append("upload", file);
          return fetch(ApiConstants.BASE_URL + "ckFinder/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
            },
            body: formData,
          })
            .then((res) => res.json())
            .then((d) => {
              if (d.url) {
                this.loader.uploaded = true;
                resolve({
                  default: ApiConstants.BASE_URL + d.url,
                });
              } else {
                reject(`Couldn't upload file: ${file.name}.`);
              }
            });
        })
    );
  }
}

function ThisCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

export default CustomTextEditor;
