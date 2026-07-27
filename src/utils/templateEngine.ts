export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\[\s*(\w+)\s*\]/g, (_match, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : `[${key}]`
  );
}
