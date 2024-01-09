import pytest
from ..flaskr.tasks import validate_and_convert, ValidationError

@pytest.mark.parametrize("data, expected_result", [
    ({'key': '10'}, 10),
    ({'key': ''}, None),
    ({}, None),
    ({'key': 'abc'}, ValidationError("Key must be a valid integer.", 400)),
    ({'key': '3'}, ValidationError("Key must be greater than or equal to 5.", 400)),
    ({'key': '20'}, ValidationError("Key must be less than or equal to 15.", 400)),
])
def test_validate_and_convert(data, expected_result):
    try:
        result = validate_and_convert(data, 'key', min_val=5, max_val=15)
        assert result == expected_result
    except ValidationError as e:
        assert str(e) == str(expected_result)
