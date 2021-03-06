import theme from './theme';
import { createMuiTheme } from '@material-ui/core/styles';

describe('Theme', () => {
  it('Creates Mui theme', () => {
    expect(Object.keys(theme)).toMatchObject(Object.keys(createMuiTheme()));
  });
});
