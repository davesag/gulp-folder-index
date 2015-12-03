'use strict';

require("mocha");

let fs          = require("fs");
let expect      = require("chai").expect;
let gulp        = require("gulp");
let gutil       = require("gulp-util");
let folderIndex = require("../");

describe("folderIndex", function(){
  it("throws an error when not given files", function(done) {
    let error;
    let fi = folderIndex({ filename: ".tmp/index.json" });

    fi.on("end", function(){
      expect(error.message).to.equal("No files found for folderIndex");
      done();
    });

    gulp.src("fake-folder/**/*.yml")
      .pipe(fi)
      .on("error", function(err){
        error = err;
        console.log(error.message);
      });
  });

  it("correctly uses defaults", function(done) {
    let fi = folderIndex();

    fi.on("data", function(data) {
      expect(data.path).to.contain("index.json");
    });

    fi.on("end", done);

    gulp.src("test/fixtures/**/*.yml")
      .pipe(fi)
      .pipe(gulp.dest("test/.tmp"));
  });

  it("generates the right JSON file with the correct folder structure", function(done) {
    let fi = folderIndex({
      filename: ".tmp/index.json"
    });

    fi.on("data", function(data) {
      expect(data.path).to.contain(".tmp/index.json");
      let contents = data.contents.toString();
      let expectedOutput = [
        'index.json',
        'nested-folder-1/faq.json',
        'nested-folder-1/index.json',
        'nested-folder-2/index.json',
        'nested-folder-1/nested-folder-1-1/index.json'
      ];

      expect(contents).to.contain("nested-folder-1/faq.json");
      expect(contents).to.contain("nested-folder-1/nested-folder-1-1/index.json");
      expect(contents).to.not.contain("index.txt");
      expect(contents).to.not.contain("nested-folder-1/nested-folder-1-1/faq.json");
      expect(JSON.parse(contents)).to.deep.equal(expectedOutput);
    });

    fi.on("end", done);

    gulp.src("test/fixtures/**/*.yml")
      .pipe(fi)
      .pipe(gulp.dest("test"));
  });

  it("generates the right JSON file with the correct prefixed folder(s) when provided", function(done) {
    let fi = folderIndex({
      filename: ".tmp/index.json",
      prefix: "prefixed-folder"
    });

    fi.on("data", function(data) {
      expect(data.path).to.contain(".tmp/index.json");
      let contents = data.contents.toString();
      let expectedOutput = [
        'prefixed-folder/index.json',
        'prefixed-folder/nested-folder-1/faq.json',
        'prefixed-folder/nested-folder-1/index.json',
        'prefixed-folder/nested-folder-2/index.json',
        'prefixed-folder/nested-folder-1/nested-folder-1-1/index.json'
      ];

      expect(contents).to.contain("prefixed-folder/nested-folder-1/faq.json");
      expect(contents).to.contain("prefixed-folder/nested-folder-1/nested-folder-1-1/index.json");
      expect(contents).to.not.contain("prefixed-folder/nested-folder-1/nested-folder-1-1/faq.json");
      expect(JSON.parse(contents)).to.deep.equal(expectedOutput);
    });

    fi.on("end", done);

    gulp.src("test/fixtures/**/*.yml")
      .pipe(fi)
      .pipe(gulp.dest("test"));
  });

  it("generates the right JSON file with the correct extensions when provided", function(done) {
    let fi = folderIndex({
      filename: ".tmp/index.json",
      extension: ".html"
    });

    fi.on("data", function(data) {
      expect(data.path).to.contain(".tmp/index.json");
      let contents = data.contents.toString();
      let expectedOutput = [
        'index.html',
        'nested-folder-1/faq.html',
        'nested-folder-1/index.html',
        'nested-folder-2/index.html',
        'nested-folder-1/nested-folder-1-1/index.html'
      ];

      expect(contents).to.contain("nested-folder-1/faq.html");
      expect(contents).to.contain("nested-folder-1/nested-folder-1-1/index.html");
      expect(contents).to.not.contain("nested-folder-1/nested-folder-1-1/faq.html");
      expect(JSON.parse(contents)).to.deep.equal(expectedOutput);
    });

    fi.on("end", done);

    gulp.src("test/fixtures/**/*.yml")
      .pipe(fi)
      .pipe(gulp.dest("test"));
  });

  it("emits an error if given a stream", function (done) {

    let srcFile = new gutil.File({
      path: "test/fixtures/index.yml",
      cwd: "test/",
      base: "test/fixtures",
      contents: fs.createReadStream("test/fixtures/index.yml")
    });

    let fi = folderIndex();

    let errorExists;

    fi.on("error", function(err) {
      expect(err).to.exist;
      if (!errorExists) {
        done();
        errorExists = true;
      }
    });

    fi.write(srcFile);
    fi.end();
  });
});