import * as ts from 'typescript';
import {Tree, SchematicsException} from '@angular-devkit/schematics';

export function parseJSON<T = any>(content: string): T {
  return JSON.parse(content.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, ''))
}

/**
 * Returns the parsed content of a json file.
 * @param host {Tree} The source tree.
 * @param path {String} The path to the file to read. Relative to the root of the tree.
 */
export function getJsonFile(host: Tree, path: string, strict = false) {
  const buffer = host.read(path);
  if (buffer === null) {
    throw new SchematicsException(`Couldn't read ${path}!`);
  }

  const content = buffer.toString('utf-8');
  try {
    if (strict) {
      return JSON.parse(content);
    }
    // remove comments :)
    return parseJSON(content);
  } catch (e) {
    throw new SchematicsException(`Couldn't parse ${path}!`);
  }
}

/**
 * Reads file from given path and Returns TypeScript source file.
 * @param host {Tree} The source tree.
 * @param path {String} The path to the file to read. Relative to the root of the tree.
 * */
export function getTypeScriptSourceFile(
  host: Tree,
  path: string,
): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not find ${path}!`);
  }

  const content = buffer.toString();
  const sourceFile = ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  return sourceFile;
}
