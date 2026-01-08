const validated = {
  required: (str: String | null) => str?.trim() !== '',
  not_null: (str: String | null) =>
    str?.trim() !== null && str?.trim() !== undefined,
  not_zero: (num: number) => num < 0,
};

const rules = {
  required: ' is Required',
  not_null: " shouldn't be empty",
  not_zero: 'should be greater than 0',
};

const validations = (form: Partial<{ rules: String }>) => {
  return Object.keys(form).some((key: String) => {
    return form[key].rule.split('|').some((rule: String) => {
      if (!validated[rule](form[key].value)) {
        toast.show(`${key} ${rules[rule]}`);
        return true;
      }
    });
  });
};

export default validations;
