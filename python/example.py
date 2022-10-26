#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author: Wenzhen

import numpy as np

a = np.array([[0, 5],
              [2, 3]])
print(np.sum(a))
print(np.sum(a, axis=0))
print(np.sum(a, axis=1))
